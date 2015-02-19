from django.conf.urls import patterns, url, include
from rest_framework.routers import DefaultRouter

from api import views

router = DefaultRouter()
router.register('players', views.PlayerViewSet)
router.register('drafts', views.DraftViewSet)
router.register('users', views.UserViewSet)
router.register('teams', views.TeamViewSet)

urlpatterns = patterns('',
    url(r'^session_info/$', views.session_info),
    url(r'^', include(router.urls)),
)
