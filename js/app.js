define(["underscore", "paper", "plane", "airport"], function (_, paper, Plane, Airport) {
    var planes = {},
        airports = [{
            name: "JFK",
            center: new paper.Point(350, 200),
            fillColor: "#0a0"
        }],
        canvas = document.getElementById('game'),
        canvas_size = new paper.Size({
            width: 600,
            height: 400
        }),
        tool = new paper.Tool(),
        maxPlanesOnScreen = 10;

    paper.setup(canvas);

    for (i in airports) {
        airports[i] = new Airport(paper, airports[i]);
    }

    /* Starting planes
    planes.push(new Plane(paper, {
        name: "plane1",
        center: new paper.Point(200, 150),
        vector: new paper.Point(0, 1),
        fillColor: "#009"
    }));
    planes.push(new Plane(paper, {
        name: "plane2",
        center: new paper.Point(150, 150),
        vector: new paper.Point(1, 1),
        fillColor: "#900"
    }));
    */


    function update(timestamp) {
        for (i in planes) {
            current_plane = planes[i];
            hitResult = false;

            //Boundaries detection
            if (current_plane.getShape().position.x + current_plane.getShape().radius <= 0
                || current_plane.getShape().position.x - current_plane.getShape().radius >= canvas_size.width
                || current_plane.getShape().position.y + current_plane.getShape().radius <= 0
                || current_plane.getShape().position.y - current_plane.getShape().radius >= canvas_size.height) {
                    current_plane.remove();
                    delete planes[current_plane.id]
                    continue;
            }

            //Collision detection
            /* hitTest() is not working very well...
            var hitResult = paper.project.hitTest(current_plane.getShape().position, {
                //tolerance: 5,
                //fill: true
                segments: true,
                stroke: false,
                fill: false,
                tolerance: 500
            });
            * */
            for (j in planes) {
                tested_plane = planes[j];
                if (tested_plane.id == current_plane.id) { continue; }
                if (current_plane.collideWith(tested_plane)) {
                    destroyPlane(current_plane);
                    destroyPlane(tested_plane);
                    break;
                }
            }
        }

        updateDashboard();
        //updateScroll();

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);

    function updateDashboard() {
        $(".dashboard .planes .count").html(getNumberOfPlanes());
    }

    function getNumberOfPlanes() {
        return Object.keys(planes).length;
    }

    function destroyPlane(plane) {
        plane.getShape().fillColor = "#F00";
        plane.stop();
        setTimeout(plane.remove.bind(plane), 1000);
        delete planes[plane.id]
    }

    function addPlane() {
        if (getNumberOfPlanes() < maxPlanesOnScreen) {
            cadran = _.random(0, 100);
            plane_type = _.sample([[15, 30], [10, 35], [20, 15]]);
            if (cadran >= 75) {
                center = new paper.Point(_.random(0, canvas.width), 0);
            } else if (cadran >= 50) {
                center = new paper.Point(canvas.width, _.random(0, canvas.height));
            } else if (cadran >= 25) {
                center = new paper.Point(_.random(0, canvas.width), canvas.height);
            } else {
                center = new paper.Point(0, _.random(0, canvas.height));
            }
            vector = paper.view.center.subtract(center);

            new_plane = new Plane(paper, {
                name: "plane" + planes.length+1,
                center: center,
                vector: vector,
                radius: plane_type[0],
                speed: plane_type[1],
                fillColor: "#" + _.sample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"], 6).join("")
            });
            planes[new_plane.id] = new_plane;
        }
        //setTimeout(addPlane, _.random(5, 15) * 1000);
        setTimeout(addPlane, 1000);
    }
    //setTimeout(addPlane, _.random(3, 5) * 1000);
    setTimeout(addPlane, 1000);

    /* If needed, scroll implementation:
    var scroll_speed = 5;
    function updateScroll(event) {
        if (paper.Key.isDown('down') || paper.Key.isDown('s')) {
            paper.view.scrollBy(new paper.Point(0, scroll_speed));
        }
        if (paper.Key.isDown('up') || paper.Key.isDown('w')) {
            paper.view.scrollBy(new paper.Point(0, -scroll_speed));
        }
        if (paper.Key.isDown('left') || paper.Key.isDown('a')) {
            paper.view.scrollBy(new paper.Point(-scroll_speed, 0));
        }
        if (paper.Key.isDown('right') || paper.Key.isDown('d')) {
            paper.view.scrollBy(new paper.Point(scroll_speed, 0));
        }
    }
    */
});
