from django.conf.urls import patterns, url
from rest_framework.urlpatterns import format_suffix_patterns

from api import views

urlpatterns = patterns('',
    url(r'^players/$', views.PlayerList.as_view()),
    url(r'^players/(?P<pk>[0-9]+)/$', views.PlayerDetails.as_view())
)

urlpatterns = format_suffix_patterns(urlpatterns)
