import json
import random
import os
from urllib2 import urlopen

import lastfm


NOIMAGE = "http://cdn.last.fm/flatness/catalogue/noimage/2/default_album_medium.png"
API_KEY = "92ae3bd20202652a8631cf7527555bf2"  # TODO: this API key is RIAARadars. create a new API key for this project
USER = "corevette"
IMG_DIR = "img"


def top_albums(num=100, user=USER, api_key=API_KEY):
    top_albums = []
    api = lastfm.Api(api_key)
    user = api.get_user(user)
    pages = num // 50 + 1  # Last.fm has 50 albums per 'page'
    for page_num in range(1, pages + 1):
        top_albums += user.get_top_albums(page=page_num)
    top_albums = top_albums[:num]
    return top_albums


def save_album():
    pass


top = top_albums(150)


albums = []
img_num = 1

for album in top:
    if album.image["large"] != NOIMAGE:
        img_src = album.image["large"]
        file_ext = img_src.split(".")[-1]
        filename = "{}.{}".format(str(album.id), file_ext)
        path = os.path.join(IMG_DIR, filename)
        print path
        with open(path, "w") as img_file:
            img_file.write(urlopen(img_src).read())
        albums.append({
            "image": path,
            "artist": album.artist.name,
            "name": album.name
        })

random.shuffle(albums)  # SHOULD RANDOMIZE ON THE CLIENT SIDE

with open("myAlbums.js", "w") as my_albums:
    my_albums.write("var albums = ")
    my_albums.write(json.dumps(albums))
