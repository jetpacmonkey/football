from django.conf.urls import patterns, url
from rest_framework.urlpatterns import format_suffix_patterns

from api import views

urlpatterns = format_suffix_patterns(
    patterns('',
        url(r'^$', views.api_root, name='api-root'),
        url(r'^players/$', views.PlayerList.as_view(), name='player-list'),
        url(r'^players/(?P<pk>[0-9]+)/$', views.PlayerDetail.as_view(), name='player-detail')
    )
)
