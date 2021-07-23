# Generated by Django 3.2.5 on 2021-07-15 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('updated_date', models.DateTimeField(auto_now=True, null=True)),
                ('create_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('content', models.TextField()),
                ('image', models.ImageField(upload_to=None)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
