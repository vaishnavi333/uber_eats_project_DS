# Generated by Django 5.1.1 on 2024-10-11 20:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0004_remove_deliveryaddress_address_line2_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cartitem',
            old_name='dish',
            new_name='dish_id',
        ),
    ]
