define(function() {

    var Airport = Class.extend({
        init: function(paper, options) {
            var self = this;

            self.paper  = paper;
            self.name   = options.name || "Lorem ipsum";
            self.fillColor = options.fillColor || "#f00";
            self.strokeColor = options.strokeColor || "#000";
            self.radius = options.radius || 10;
            self.center = options.center || paper.view.center;
            self.size = options.size || [20, 100];
            self.angle = options.angle || 45;


            self.shape = new paper.Shape.Rectangle({
                //topLeft: new paper.Point(self.center).subtract(self.size/2),
                //bottomRight: new paper.Point(self.center).add(self.size/2),
                point: self.center,
                size: self.size,
                fillColor: self.fillColor,
                strokeColor: self.strokeColor,
                rotation: self.angle
            });
        },

        getShape: function() {
            return this.shape;
        },
    });

    return Airport;
});
