from django.db import models
import datetime
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
import os
import glob
import zipfile
import geopandas as gpd
from geo.Geoserver import Geoserver
from sqlalchemy import *
from pg.pg import Pg



# initializing the library
db = Pg(dbname='postgres',user='postgres',
        password='admin',host='localhost',port='5432')
geo = Geoserver('http://127.0.0.1:8080/geoserver', username='admin', password='geoserver')


class Shp(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=1000,blank=True)
    file = models.FileField(upload_to='%Y/%m/%d')
    uploaded_date = models.DateField(default = datetime.date.today, blank=True)


    def __str__(self):
        return self.name

@receiver(post_save,sender=Shp)
def publish_data(sender,instance,created,**kwargs):
    file = instance.file.path
    file_format = os.path.basename(file).split('.')[-1]
    file_name = os.path.basename(file).split('.')[0]
    file_path = os.path.basename(file)
    name = instance.name
    conn_str = 'postgresql://postgres:admin@localhost:5432/postgres'

    with zipfile.ZipFile(file,'r') as zip_ref:
        zip_ref.extractall(file_path)

    os.remove(file)

    shp = glob.glob(r'{}/**/*.shp'.format(file_path),recursive=true)

    try:
        req_shp = shp[0]
        gdf = gpd.read_file(req_shp)  # make geodataframe
        engine = create_engine(conn_str)
        gdf.to_postgis(
            con=engine,
            schema='data',
            name=name,
            if_exists="replace")

        for s in shp:
            os.remove(s)

    except Exception as e:
        for s in shp:
            os.remove(s)

        instance.delete()
        print("There is problem during shp upload: ",e)
    
    geo.create_featurestore(store_name='geoApp1',workspace='geoWork',db='postgres',host='localhost', 
                            pg_user='postgres', pg_password='admin',schema='data')
    
    geo.publish_featurestore(
        workspace='geoWork', store_name='geoApp1', pg_table=name)

    geo.create_outline_featurestyle('geoApp_shp1',workspace='geoWork')

    geo.publish_style(
        layer_name=name, style_name='geoApp_shp1', workspace='geoWork')

@receiver(post_delete, sender=Shp)
def delete_data(sender, instance, **kwargs):
    db.delete_table(instance.name, schema='data')
    
    
    