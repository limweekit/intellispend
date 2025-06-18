from django.http import FileResponse
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from .utils import export_data_to_csv


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_csv(request):
    filepath = export_data_to_csv()
    return FileResponse(open(filepath, 'rb'), as_attachment=True)