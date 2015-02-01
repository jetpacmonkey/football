from django.conf.urls import patterns, url

from draft import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^create$', views.create, name='create'),
    url(r'^(?P<draftId>\d+)$', views.singleDraft, name='singleDraft'),
)
