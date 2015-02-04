from django.shortcuts import render, get_object_or_404

from draft.models import Draft


def index(request):
    user_drafts = request.user.draft_set.all()
    return render(request, 'draft/index.html', {
        "user_drafts": user_drafts
    })


def create(request):
    return render(request, 'draft/create.html', {
        'PLAYER_TYPE_CHOICES': Draft.PLAYER_TYPE_CHOICES,
        'DEFAULT_PLAYER_TYPE': Draft._meta.get_field_by_name('type')[0].default
    })


def singleDraft(request, draftId):
    draft = get_object_or_404(Draft, id=draftId)
    return render(request, 'draft/singleDraft.html', {

    })
