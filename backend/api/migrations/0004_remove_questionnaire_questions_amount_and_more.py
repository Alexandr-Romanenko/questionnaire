# Generated by Django 5.1.7 on 2025-03-21 10:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_questionnaire_description'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='questionnaire',
            name='questions_amount',
        ),
        migrations.AlterField(
            model_name='questionnaire',
            name='description',
            field=models.TextField(max_length=200),
        ),
    ]
