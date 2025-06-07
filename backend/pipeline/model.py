import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score


MODEL_PATH = os.path.join(os.path.dirname(__file__), 'artifacts', 'goal_predictor.pkl')


# choose and filter features from the dataframe
def prepare_features(df):
    features = ['total_income', 'total_expenses', 'savings', 'savings_rate', 'goal_duration_months']
    X = df[features].fillna(0)
    return X

# create column to check if goal is achieved
def prepare_target(df):
    df = df.copy()
    df['goal_achieved'] = (df['savings'] * df['goal_duration_months'] >= df['goal_amount']).astype(int)
    return df['goal_achieved']

# trains random forest model and saves it to disk
def train_model(df):
    X = prepare_features(df)
    y = prepare_target(df)

    # check for sufficient diversity
    if len(set(y)) < 2:
        raise ValueError("Data must have at least two classes")

    # split dataset into 80% training 20% testing
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)

    preds = clf.predict(X_test)
    print(f'Accuracy: {accuracy_score(y_test, preds):.2f}')

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(clf, MODEL_PATH)
    return clf


def load_model():
    if os.path.exists(MODEL_PATH):
        return joblib.load(MODEL_PATH)
    else:
        raise FileNotFoundError("Model not found")


# use pre trained model from disk to predict whether the user can achieve his goal
def predict(df):
    clf = load_model()
    X = prepare_features(df)

    # binary classification
    if len(clf.classes_) == 2:
        predictions = clf.predict_proba(X)[:, 1]
    else:
        single_class = clf.classes_[0]
        predictions = [float(single_class)] * len(X)

    return predictions
