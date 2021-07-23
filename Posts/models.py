from django.db import models
from Users.models import CreateUdateDates
# Create your models here.


class PostManager(models.Manager):

    def get_queryset(self):
        return super(PostManager, self).get_queryset().filter(owner__is_active=True)

    def create_post(self, request_user, **extra_fields):
        post = self.model(**extra_fields)
        post.owner = request_user
        post.save()
        return post



class Post(CreateUdateDates):
    title = models.CharField(max_length= 200, blank= True)
    owner = models.ForeignKey('Users.CustomUser', related_name='posts', on_delete=models.CASCADE, null= True)
    description = models.TextField(blank= True)
    # create_date = models.DateTimeField(auto_now_add= True, editable= False)
    # updated_date = models.DateTimeField(auto_now= True, editable= False)
    objects= PostManager()

    def __str__(self):
        return self.title

    def create(self, reqeust_user, validated_data):
        return Post.objects.create_post(reqeust_user, **validated_data)



