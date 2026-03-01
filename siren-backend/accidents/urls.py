from django.urls import path
from .views import AcceptAccidentView, AccidentCreateView, AssignedAccidentsView,RejectAccidentView
from .views import police_assigned_accidents
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('accidents/create/', AccidentCreateView.as_view(), name='create-accidents'),
    path('accidents/assigned/', AssignedAccidentsView.as_view(), name='assigned-accidents'),
    path('accidents/<int:accident_id>/accept/', AcceptAccidentView.as_view(), name='accept-accident'),
    path('accidents/<int:accident_id>/reject/', RejectAccidentView.as_view(), name='reject-accident'),
    path("police/assigned/", police_assigned_accidents),


]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
