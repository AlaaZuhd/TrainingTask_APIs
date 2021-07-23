from rest_framework import serializers
from .models import CustomUser


class CustomUserDisplaySerializer(serializers.HyperlinkedModelSerializer):

    owner = serializers.ReadOnlyField(source= 'owner.user_name')
    posts = serializers.HyperlinkedRelatedField(many= True, view_name= 'posts-detail', read_only= True)
    comments = serializers.HyperlinkedRelatedField(many= True, view_name= 'comments-detail', read_only= True)
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'user_name', 'create_date', 'updated_date', 'birth_date', 'posts', 'comments', 'owner']

    def update(self, instance, validated_data):
        validated_data.pop('email', None)  # prevent myfield from being updated
        return super().update(instance, validated_data)

class CustomUserCreateSerializer(serializers.ModelSerializer):

    password = serializers.CharField(style={'input_type': 'password'})
    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'user_name', 'birth_date']


class CustomUserUpdateSerializer(serializers.ModelSerializer):

    model = CustomUser
    confirm_password = serializers.CharField(max_length=100, style={'input_type': 'password'})
    password = serializers.CharField(style={'input_type': 'password'})

    class Meta:
        model = CustomUser
        fields = ['user_name', 'password', 'confirm_password',  'birth_date']

    def validate(self, data):
        if not data.get('password') or not data.get('confirm_password'):
            raise serializers.ValidationError("Please enter a password and "
                                              "confirm it.")
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError("Those passwords don't match.")
        return data





class CustomUserResetPasswordSerializer(serializers.Serializer):
    model = CustomUser
    confirm_password = serializers.CharField(max_length=100, style={'input_type': 'password'})
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, data):
        if not data.get('password') or not data.get('confirm_password'):
            raise serializers.ValidationError("Please enter a password and "
                                              "confirm it.")
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError("Those passwords don't match.")
        return data

