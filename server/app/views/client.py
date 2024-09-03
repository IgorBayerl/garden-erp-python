from django.http import FileResponse, HttpResponseNotFound
from django.views import View
import os
from django.conf import settings

class IndexView(View):
    def get(self, request, *args, **kwargs):
        index_file_path = os.path.join(settings.STATICFILES_DIRS[0], 'index.html')
        if os.path.exists(index_file_path):
            return FileResponse(open(index_file_path, 'rb'))
        else:
            return HttpResponseNotFound('index.html not found')
