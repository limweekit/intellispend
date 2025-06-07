import pandas as pd

from expenses.models import Expense
from goals.models import Goal
from income.models import Income
from pipeline.model import train_model


# ETL data pipeline for smart goal setting


# load data from ORM into dataframes
def extract_data():
    expenses = Expense.objects.select_related('category', 'user').values('user_id', 'amount', 'date', 'category_id')
    income = Income.objects.select_related('category', 'user').values('user_id', 'amount', 'date', 'category_id')
    goals = Goal.objects.select_related('user').values('user_id', 'amount', 'created_at', 'deadline')
    return pd.DataFrame(expenses), pd.DataFrame(income), pd.DataFrame(goals)

# standardise date formats, clean up rows with no amount
def transform_data(expenses_df, income_df, goals_df):
    expenses_df['date'] = pd.to_datetime(expenses_df['date'])
    income_df['date'] = pd.to_datetime(income_df['date'])
    goals_df['created_at'] = goals_df['created_at'].dt.tz_localize(None)
    goals_df['deadline'] = goals_df['deadline'].dt.tz_localize(None)
    expenses_df.dropna(subset=['amount'], inplace=True)
    income_df.dropna(subset=['amount'], inplace=True)

    # add month field for aggregation
    expenses_df['month'] = expenses_df['date'].dt.to_period('M')
    income_df['month'] = income_df['date'].dt.to_period('M')

    # aggregate monthly total expenses/income
    expenses_summary = expenses_df.groupby(['user_id', 'month'])['amount'].sum().reset_index(name='total_expenses')
    income_summary = income_df.groupby(['user_id', 'month'])['amount'].sum().reset_index(name='total_income')

    # merge monthly summaries
    monthly = pd.merge(income_summary, expenses_summary, on=['user_id', 'month'], how='outer').fillna(0)
    monthly['savings'] = monthly['total_income'] - monthly['total_expenses']
    monthly['savings_rate'] = monthly['savings'] / monthly['total_income'].replace(0, 1)
    monthly['month_start'] = monthly['month'].dt.to_timestamp()

    # calc goal durations
    goals_df['goal_duration_months'] = ((goals_df['deadline'] - goals_df['created_at']) / pd.Timedelta(days=30)).round()
    goals_df = goals_df.rename(columns={'amount': 'goal_amount'})

    # get past income/expenses for each goal
    all_features = []

    for _, goal in goals_df.iterrows():
        user_id = goal['user_id']
        created_at = goal['created_at']

        user_monthly = monthly[(monthly['user_id'] == user_id) & (monthly['month_start'] < created_at)]

        # aggregate last 6 months of data or all if insufficient
        recent = user_monthly.sort_values('month_start').tail(6)
        row = {
            'user_id': user_id,
            'month': recent['month'].max().strftime('%Y-%m'),
            'total_income': recent['total_income'].mean(),
            'total_expenses': recent['total_expenses'].mean(),
            'savings': recent['savings'].mean(),
            'savings_rate': recent['savings_rate'].mean(),
            'goal_duration_months': goal['goal_duration_months'],
            'goal_amount': goal['goal_amount'],
        }

        all_features.append(row)

    return pd.DataFrame(all_features)


def load_data(df):
    processed_df = df.fillna('')
    return processed_df.to_dict(orient='records')


def run_pipeline():
    expenses_df, income_df, goals_df = extract_data()
    df = transform_data(expenses_df, income_df, goals_df)
    train_model(df)