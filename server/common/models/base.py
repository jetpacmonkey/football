from django.db import models

class Base(models.Model):
    pass

    class Meta:
        abstract = True
