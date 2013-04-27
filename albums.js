(function ($, getDomColor) {
    var currSelected; // SHOULD NOT BE A GLOBAL VARIABLE

    // Taken from http://stackoverflow.com/questions/4726344/how-do-i-change-text-color-determined-by-the-background-color
    var idealTextColor = function (bgColor) {
        var nThreshold = 105, r, g, b, bgDelta;

        r = parseInt(bgColor.substring(1, 3), 16);
        g = parseInt(bgColor.substring(3, 5), 16);
        b = parseInt(bgColor.substring(5, 7), 16);

        bgDelta = (r * 0.299) + (g * 0.587) + (b * 0.114);

        return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
    };

    ///////////////////

    var AlbumTile = function (album) {
        this.$div = $("<div class='artwork' data-segue-src='" + album.image + "'>");
        this.$elem = $("<div class='album'><div class='fade'></div></div>").append(this.$div);
        this.album = album;

        this.$div.segue(2000, function (img) {
            this.img = img;
        }.bind(this));

        this.$elem.hover(function () {
            if (this.domColor === undefined) {
                this.domColor = this.getDomColor();
            }

            if (this !== currSelected) {
                this.glow();
            }
        }.bind(this), function () {
            if (this !== currSelected) {
                this.unglow();
            }
        }.bind(this));

        this.$elem.click(function () {
            if (currSelected !== undefined && currSelected !== this) {
                currSelected.unglow();
            }
            currSelected = this;
            this.showDetails();
        }.bind(this));

        $("#albums").append(this.$elem);
    };

    AlbumTile.prototype.glow = function () {
        this.$div.css({
            "box-shadow": "0px 0px 40px " + this.domColor,
            "position": "absolute"
        });
    };

    AlbumTile.prototype.unglow = function () {
        this.$div.css({
            "box-shadow": "0px 0px 0px black",
            "position": "static",
            "z-index": 7
        });
    };

    AlbumTile.prototype.showDetails = function () {
        var details = ["Name", this.album.name, "", "Artist", this.album.artist].join("<br>");
        this.$div.css({
            "box-shadow": "0px 0px 0px black",
            "z-index": 10
        });

        $("#details").show().css({
            "box-shadow": "0px 0px 40px " + this.domColor
        }).offset(this.$div.offset()).html(details);
    };

    AlbumTile.prototype.getDomColor = function () {
        var color;
        if (!this.img || this.img.complete !== true) {
            return undefined;
        }
        color = getDomColor(this.img);
        return "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
    };

    AlbumTile.prototype.remove = function () {
        this.$elem.remove();
    };


    var AlbumView = function () {
        var visible = this.visibleTiles();

        this.albumTiles = [];
        this.addIndex = 0;
        this.addTiles(visible);

        $(window).resize(function () {
            var currVisible = this.visibleTiles(),
                delta;
            if (currVisible !== visible) {
                delta = currVisible - visible;
                visible = currVisible;
                if (delta > 0) {
                    this.addTiles(delta);
                } else {
                    this.removeTiles(-delta);
                }
            }
        }.bind(this));
    };

    AlbumView.prototype.visibleTiles = function () {
        var cols = Math.ceil($(window).width() / 100),
            rows = Math.ceil($(window).height() / 100);
        return cols * rows;
    };

    AlbumView.prototype.addTiles = function (num) {
        var i;
        for (i = 0; i < num; i += 1) {
            this.albumTiles.push(new AlbumTile(window.albums[(this.addIndex + i) % window.albums.length]));
        }
        this.addIndex += num;
    };

    AlbumView.prototype.removeTiles = function (num) {
        var i;
        for (i = 0; i < num; i += 1) {
            this.albumTiles.pop().remove();
        }
        this.addIndex -= num;
    };

    $(function () {
        var av = new AlbumView();
    });
}(window.jQuery, window.getDominantColor));
