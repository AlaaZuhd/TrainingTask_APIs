from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.HyperlinkedModelSerializer):

    owner = serializers.ReadOnlyField(source='owner.id')
    post = serializers.ReadOnlyField(source='post.id')
    image = serializers.ImageField(max_length=None, allow_empty_file=False)
    class Meta:
        model = Comment
        #fields = '__all__'
        fields = ['id', 'content', 'owner', 'post', 'create_date', 'updated_date', 'image']


class CreateCommentSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Comment
        fields = ['content', 'image']

