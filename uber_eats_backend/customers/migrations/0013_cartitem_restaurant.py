# Generated by Django 5.1.1 on 2024-10-24 20:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0012_customer_email'),
        ('restaurants', '0005_delete_restaurantowner'),
    ]

    operations = [
        migrations.AddField(
            model_name='cartitem',
            name='restaurant',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='restaurants.restaurant'),
        ),
    ]
