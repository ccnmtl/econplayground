# Generated by Django 2.0.4 on 2018-04-03 15:51

from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0033_auto_20180330_1502'),
    ]

    operations = [
        migrations.AlterField(
            model_name='graph',
            name='line_3_slope',
            field=models.DecimalField(decimal_places=4, default=Decimal('999'), max_digits=12),
        ),
    ]
