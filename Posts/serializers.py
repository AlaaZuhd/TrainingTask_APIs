from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.HyperlinkedModelSerializer):

    #owner = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    ##owner = serializers.ReadOnlyField(source='owner.id')
    owner = serializers.ReadOnlyField(source='owner.id')
    comments = serializers.HyperlinkedRelatedField(many= True, view_name= 'comments-detail', read_only= True)
    class Meta:
        model = Post
        #fields = '__all__'
        fields = ['id', 'title', 'owner', 'description', 'comments', 'create_date', 'updated_date']