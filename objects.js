/// <reference path="third_party/three.js" />

function Cube(color, x, y, z) {

    x = x || 0;
    y = y || 0;
    z = z || 0;

    const material = new THREE.MeshLambertMaterial({ color: color });

    THREE.Mesh.call(
        this,
        new THREE.BoxGeometry(1, 1, 1),
        material
    );

    this.position.set(x, y, z);

    return this;
}
Cube.prototype = Object.create(THREE.Mesh.prototype);

function Triangle(color, vertex1, vertex2, vertex3) {

    let geometry = new THREE.Geometry();


    geometry.vertices.push(vertex1, vertex2, vertex3);

    let face = new THREE.Face3(0, 1, 2);

    geometry.faces.push(face);

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    THREE.Mesh.call(
        this,
        geometry,
        new THREE.MeshLambertMaterial({ color: color })
        );

    return this;
}
Triangle.prototype = Object.create(THREE.Mesh.prototype);

function Terrain(size, aplitude) {

    let geometry = new THREE.Geometry();

    let grid = [];
    let gridSize = size + 1;
    aplitude = aplitude || 1;

    for (var i = 0; i < gridSize; i++) {
        grid[i] = [];
        for (var j = 0; j < gridSize; j++) {
            let vertex = new THREE.Vector3(-gridSize / 2 + i, 0, -gridSize / 2 + j);
            grid[i][j] = vertex;
            geometry.vertices.push(vertex);
        }
    }

    for (var i = 0; i < gridSize - 1; i++) {
        for (var j = 0; j < gridSize - 1; j++) {
            let face1 = new THREE.Face3(i * gridSize + j, i * gridSize + (j + 1), (i + 1) * gridSize + (j + 1));
            let face2 = new THREE.Face3(i * gridSize + j, (i + 1) * gridSize + (j + 1), (i + 1) * gridSize + j);

            geometry.faces.push(face1, face2);
        }
    }

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    THREE.Mesh.call(
        this,
        geometry,
        new THREE.MeshLambertMaterial({ color: 0x00CC00 })
        );

    this.castShadow = true;
    this.receiveShadow = true;

    this.generateTerrain = function generateTerrain() {
        this.DiamondStep(size / 2, size / 2, size)
    }

    this.DiamondStep = function DiamondStep(x, y, size) {
        if (size % 2 != 0 || size <= 0)
            return;

        let step = size / 2;
        grid[x][y].y = (
            grid[x - step][y + step].y +
            grid[x + step][y + step].y +
            grid[x + step][y - step].y +
            grid[x - step][y - size / 2].y
            ) / 4 + Math.random() * Math.log(size) / Math.log(2) * aplitude;

        geometry.verticesNeedUpdate = true;

        this.SquareStep(x - step, y, size);
        this.SquareStep(x + step, y, size);
        this.SquareStep(x, y - step, size);
        this.SquareStep(x, y + step, size);

        this.DiamondStep(x - step / 2, y + step / 2, step);
        this.DiamondStep(x + step / 2, y + step / 2, step);
        this.DiamondStep(x - step / 2, y - step / 2, step);
        this.DiamondStep(x + step / 2, y - step / 2, step);
    }

    this.SquareStep = function SquareStep(x, y, size) {
        if (size % 2 != 0 || size <= 0)
            return;

        let step = size / 2;

        let sum = 0, num = 0;
        if (IsVertexValid(x, y + step)) {
            num++;
            sum += grid[x][y + step].y;
        }
        if (IsVertexValid(x, y - step)) {
            num++;
            sum += grid[x][y - step].y;
        }
        if (IsVertexValid(x + step, y)) {
            num++;
            sum += grid[x + step][y].y;
        }
        if (IsVertexValid(x - step, y)) {
            num++;
            sum += grid[x - step][y].y;
        }
        sum /= num;

        grid[x][y].y = sum + Math.random() * Math.log(size) / Math.log(2) * aplitude;

        geometry.verticesNeedUpdate = true;
    }

    function IsVertexValid(x, y) {
        if (!grid[x])
            return false;
        if (!grid[x][y])
            return false;
        return true;
    }

    return this;

}
Terrain.prototype = Object.create(THREE.Mesh.prototype);