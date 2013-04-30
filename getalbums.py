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


def save_album_art(album):
    if album.image["large"] != NOIMAGE:
        try:
            album_id, img_src = str(album.id), album.image["large"]
            file_ext = img_src.split(".")[-1]
            filename = "{}.{}".format(album_id, file_ext)
            path = os.path.join(IMG_DIR, filename)
            with open(path, "w") as img_file:
                img_file.write(urlopen(img_src).read())
            return path
        except lastfm.error.OperationFailedError:
            return None
    else:
        return None


top_albums = top_albums(150)
saved_albums = []

for album in top_albums:
    path = save_album_art(album)
    if path != None:
        print album.name.encode("utf8")
        saved_albums.append({
            "image": path,
            "artist": album.artist.name,
            "name": album.name
        })
    else:
        print "Failed: {}".format(album.name)

random.shuffle(saved_albums)  # SHOULD RANDOMIZE ON THE CLIENT SIDE

with open("myAlbums.js", "w") as my_albums:
    my_albums.write("var albums = ")
    my_albums.write(json.dumps(saved_albums))
