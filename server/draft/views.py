from django.shortcuts import render

from draft.models import Draft


def index(request):
    return create(request)


# Create your views here.
def create(request):
    return render(request, 'draft/create.html', {
        'PLAYER_TYPE_CHOICES': Draft.PLAYER_TYPE_CHOICES,
        'DEFAULT_PLAYER_TYPE': Draft._meta.get_field_by_name('type')[0].default
    })
