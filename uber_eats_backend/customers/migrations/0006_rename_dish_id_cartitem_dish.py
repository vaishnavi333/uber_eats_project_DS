# Generated by Django 5.1.1 on 2024-10-11 20:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0005_rename_dish_cartitem_dish_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cartitem',
            old_name='dish_id',
            new_name='dish',
        ),
    ]
