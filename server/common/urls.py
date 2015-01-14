from django.conf.urls import patterns, url

from common import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^login/', 'django.contrib.auth.views.login', {'template_name': 'common/login.html'}, name='login'),
    url(r'^logout/', 'django.contrib.auth.views.logout_then_login', name='logout')
)
