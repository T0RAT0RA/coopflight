define(function() {

    var Plane = Class.extend({
        init: function(paper, options) {
            var self = this;

            self.paper  = paper;
            self.id   = options.id || Date.now();
            self.name   = options.name || "Lorem ipsum";
            self.fillColor = options.fillColor || "#fff";
            self.strokeColor = options.strokeColor || "#600";
            self.radius = options.radius || 10;
            self.center = options.center || paper.view.center;
            self.vector = options.vector || new paper.Point(1, 1);
            self.speed = options.speed || 30; //pixels per sec

            self.isDragging = false;
            self.isStopped = false;
            self.position = 0;

            self.shape = new paper.Shape.Circle({
                center: self.center,
                radius: self.radius,
                fillColor: self.fillColor,
                strokeColor: self.strokeColor,
            });
            /*
            self.angle_offset = 90;
            self.shape = new paper.Path.RegularPolygon({
                center: options.center || paper.view.center,
                sides: 3,
                radius: options.radius || 10,
                fillColor: self.fillColor,
                strokeColor: self.strokeColor,
                rotation: self.angle_offset
            });
            */

            self.shape.onFrame = function (event) {
                if (self.isStopped) { return; }
                if (self.path && self.position < self.path.length) {
                    var new_position = self.path.getPointAt(self.position),
                        vector = new_position.subtract(self.shape.position);

                    self.shape.rotate(vector.angle - self.vector.angle);
                    self.vector = vector;

                    self.shape.position = new_position;
                    self.position += event.delta * self.speed;
                } else {
                    if (self.path && !self.isDragging) {
                        self.path.remove();
                    }
                    self.shape.translate(self.vector.normalize().multiply(event.delta * self.speed));
                }
            }

            self.bindControls();
        },

        getShape: function() {
            return this.shape;
        },

        remove: function() {
            if (this.path) {
                this.path.remove();
            }
            this.shape.remove();
        },

        stop: function() {
            this.isStopped = true;
            if (this.path) {
                this.path.remove();
            }
        },

        start: function() {
            this.isStopped = false;
        },

        collideWith: function(circle) {
              var dx = this.getShape().position.x - circle.getShape().position.x,
                  dy = this.getShape().position.y - circle.getShape().position.y,
                  dist = this.radius + circle.radius;

              return (dx * dx + dy * dy <= dist * dist)
        },

        bindControls: function() {
            var self = this;

            self.shape.onMouseDown = function(event) {
                if (self.path) { self.path.remove(); }

                self.path = new self.paper.Path({
                    segments: [event.point],
                    strokeColor: self.fillColor
                });
                self.path.onMouseUp =  function (event) {
                    self.isDragging = false;
                    self.path.simplify(50);
                    self.path.opacity = 0.5;
                }

                self.isDragging = true;
                self.position = 0;
            };

            self.shape.onMouseDrag =  function (event) {
                if (!self.isDragging) { return; }
                if (self.path.length >= 1000) { self.path.onMouseUp(); return; }
                self.path.add(event.point);
            }
        }
    });

    return Plane;
});
