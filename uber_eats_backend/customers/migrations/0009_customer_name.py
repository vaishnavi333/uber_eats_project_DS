# Generated by Django 5.1.1 on 2024-10-12 05:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0008_cartitem_state'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='name',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
