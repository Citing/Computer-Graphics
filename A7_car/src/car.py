# This program generates the model of a robot car
from math import *

fileName = 'car.obj'

boardLength_down = 0.28
boardWidth_down = 0.28
boardThickness_down = 0.005
boardHeight_down = 0.06

boardLength_up = 0.14
boardWidth_up = 0.14
boardThickness_up = 0.005
boardHeight_up = 0.1

wheelThickness = 0.01

HWidth = 0.03
HThickness = 0.002
HLength = 0.1

# Technique 1: Polygonal Meshes
def polygonalMeshes(f, polygon):
    for vertex in polygon:
        f.write('v ')
        f.write(' '.join(str(i) for i in vertex) + '\n')
    f.write('f ')
    for i in range(len(polygon), 0, -1):
        f.write('-' + str(i) + ' ')
    f.write('\n')

def drawBoard(f, length, width, thickness, height):
    polygonalMeshes(f, [[length / 2, width / 2, height], 
                        [length / 2, -width / 2, height], 
                        [-length / 2, -width / 2, height], 
                        [-length / 2, width / 2, height]])
    polygonalMeshes(f, [[length / 2, width / 2, height + thickness], 
                        [length / 2, -width / 2, height + thickness], 
                        [-length / 2, -width / 2, height + thickness], 
                        [-length / 2, width / 2, height + thickness]])
    polygonalMeshes(f, [[length / 2, width / 2, height], 
                        [length / 2, width / 2, height + thickness], 
                        [-length / 2, width / 2, height + thickness], 
                        [-length / 2, width / 2, height]])
    polygonalMeshes(f, [[-length / 2, width / 2, height], 
                        [-length / 2, width / 2, height + thickness], 
                        [-length / 2, -width / 2, height + thickness], 
                        [-length / 2, -width / 2, height]])
    polygonalMeshes(f, [[-length / 2, -width / 2, height], 
                        [-length / 2, -width / 2, height + thickness], 
                        [length / 2, -width / 2, height + thickness], 
                        [length / 2, -width / 2, height]])
    polygonalMeshes(f, [[length / 2, -width / 2, height], 
                        [length / 2, -width / 2, height + thickness], 
                        [length / 2, width / 2, height + thickness], 
                        [length / 2, width / 2, height]])

def drawPillar(f, x, y, length, thickness, height):
    polygonalMeshes(f, [[x + length / 2, y + length * sqrt(3) / 2, height], 
                        [x - length / 2, y + length * sqrt(3) / 2, height], 
                        [x - length, y, height], 
                        [x - length / 2, y - length * sqrt(3) / 2, height],
                        [x + length / 2, y - length * sqrt(3) / 2, height],
                        [x + length, y, height]])
    polygonalMeshes(f, [[x + length / 2, y + length * sqrt(3) / 2, height + thickness], 
                        [x - length / 2, y + length * sqrt(3) / 2, height + thickness], 
                        [x - length, y, height + thickness], 
                        [x - length / 2, y - length * sqrt(3) / 2, height + thickness],
                        [x + length / 2, y - length * sqrt(3) / 2, height + thickness],
                        [x + length, y, height + thickness]])

    polygonalMeshes(f, [[x - length / 2, y + length * sqrt(3) / 2, height], 
                        [x + length / 2, y + length * sqrt(3) / 2, height], 
                        [x + length / 2, y + length * sqrt(3) / 2, height + thickness], 
                        [x - length / 2, y + length * sqrt(3) / 2, height + thickness]])
    polygonalMeshes(f, [[x - length, y, height], 
                        [x - length / 2, y + length * sqrt(3) / 2, height], 
                        [x - length / 2, y + length * sqrt(3) / 2, height + thickness], 
                        [x - length, y, height + thickness]])
    polygonalMeshes(f, [[x - length / 2, y - length * sqrt(3) / 2, height], 
                        [x - length, y, height], 
                        [x - length, y, height + thickness], 
                        [x - length / 2, y - length * sqrt(3) / 2, height + thickness]])
    polygonalMeshes(f, [[x + length / 2, y - length * sqrt(3) / 2, height], 
                        [x - length / 2, y - length * sqrt(3) / 2, height], 
                        [x - length / 2, y - length * sqrt(3) / 2, height + thickness], 
                        [x + length / 2, y - length * sqrt(3) / 2, height + thickness]])
    polygonalMeshes(f, [[x + length, y, height], 
                        [x + length / 2, y - length * sqrt(3) / 2, height], 
                        [x + length / 2, y - length * sqrt(3) / 2, height + thickness], 
                        [x + length, y, height + thickness]])
    polygonalMeshes(f, [[x + length / 2, y + length * sqrt(3) / 2, height], 
                        [x + length, y, height], 
                        [x + length, y, height + thickness], 
                        [x + length / 2, y + length * sqrt(3) / 2, height + thickness]])
def drawPillars(f):
    drawPillar(f, boardLength_up / 2 - 0.01, boardWidth_up / 2 - 0.01, 0.005, boardHeight_up - boardHeight_down - boardThickness_down, boardHeight_down + boardThickness_down)
    drawPillar(f, -boardLength_up / 2 + 0.01, boardWidth_up / 2 - 0.01, 0.005, boardHeight_up - boardHeight_down - boardThickness_down, boardHeight_down + boardThickness_down)
    drawPillar(f, -boardLength_up / 2 + 0.01, -boardWidth_up / 2 + 0.01, 0.005, boardHeight_up - boardHeight_down - boardThickness_down, boardHeight_down + boardThickness_down)
    drawPillar(f, boardLength_up / 2 - 0.01, -boardWidth_up / 2 + 0.01, 0.005, boardHeight_up - boardHeight_down - boardThickness_down, boardHeight_down + boardThickness_down)

# Technique 2: Subdivision
def drawCircle(r):
    vertex = [[-r * sqrt(3), 0], [r * sqrt(3), 0], [0, r * 3]]
    # number of iterations
    itNum = 12
    for i in range(itNum):
        vertex_new = []
        for j in range(len(vertex)):
            vertex_new.append([(2 * vertex[j][0] + vertex[(j + 1) % len(vertex)][0]) / 3, (2 * vertex[j][1] + vertex[(j + 1) % len(vertex)][1]) / 3])
            vertex_new.append([(vertex[j][0] + 2 * vertex[(j + 1) % len(vertex)][0]) / 3, (vertex[j][1] + 2 * vertex[(j + 1) % len(vertex)][1]) / 3])
        vertex = []
        vertex = list(vertex_new)
    return vertex

def drawWheel(f, x, y, r, thickness, circle):
    circle_i = []
    circle_e = []
    inter = []
    for i in range(len(circle)):
        circle_i.append([x, y + circle[i][0], r + circle[i][1] - 0.005])
        circle_e.append([x + thickness, y + circle[i][0], r + circle[i][1] - 0.005])
    for i in range(len(circle)):
        inter.append([circle_i[i], circle_e[i], circle_e[(i + 1) % len(circle)], circle_i[(i + 1) % len(circle)]])
    if thickness > 0:
        circle_e.reverse()
    else:
        circle_i.reverse()
    polygonalMeshes(f, circle_i)
    polygonalMeshes(f, circle_e)
    for i in inter:
        polygonalMeshes(f, i)
    
def drawWheels(f):
    circle = drawCircle(boardHeight_down / 2)
    drawWheel(f, boardLength_down / 2, boardWidth_down / 2 - 0.015, boardHeight_down / 2, wheelThickness, circle)
    drawWheel(f, -boardLength_down / 2, -boardWidth_down / 2 + 0.015, boardHeight_down / 2, -wheelThickness, circle)
    drawWheel(f, -boardLength_down / 2, boardWidth_down / 2 - 0.015, boardHeight_down / 2, -wheelThickness, circle)
    drawWheel(f, boardLength_down / 2, -boardWidth_down / 2 + 0.015, boardHeight_down / 2, wheelThickness, circle)

def drawH(f, startX, startY, startZ, endX, endY, endZ):
    polygonalMeshes(f, [[startX - HWidth / 2, startY - HThickness / 2, startZ],
                        [startX - HWidth / 2, startY + HThickness / 2, startZ],
                        [endX - HWidth / 2, endY + HThickness / 2, endZ],
                        [endX - HWidth / 2, endY - HThickness / 2, endZ]])
    polygonalMeshes(f, [[startX + HWidth / 2, startY + HThickness / 2, startZ],
                        [startX + HWidth / 2, startY - HThickness / 2, startZ],
                        [endX + HWidth / 2, endY - HThickness / 2, endZ],
                        [endX + HWidth / 2, endY + HThickness / 2, endZ]])
    polygonalMeshes(f, [[(startX + endX) / 2 + HWidth / 2, (startY + endY) / 2 - HThickness / 2, (startZ + endZ) / 2],
                        [(startX + endX) / 2 - HWidth / 2, (startY + endY) / 2 - HThickness / 2, (startZ + endZ) / 2],
                        [(startX + endX) / 2 - HWidth / 2, (startY + endY) / 2 + HThickness / 2, (startZ + endZ) / 2],
                        [(startX + endX) / 2 + HWidth / 2, (startY + endY) / 2 + HThickness / 2, (startZ + endZ) / 2]])

# Technique 3: L-system
def drawArm(f, armStructure):
    x = 0
    y = 0
    z = boardHeight_up + boardThickness_up
    angle = 0
    for i in armStructure:
        if i is 'S':
            pass
        elif i is 'L':
            angle = angle + pi / 3
        elif i is 'R':
            angle = angle - pi / 3
        drawH(f, x, y, z, x, y + HLength * sin(angle), z + HLength * cos(angle))
        y = y + HLength * sin(angle)
        z = z + HLength * cos(angle)

def drawCar(f):
    drawBoard(f, boardLength_down, boardWidth_down, boardThickness_down, boardHeight_down)
    drawBoard(f, boardLength_up, boardWidth_up, boardThickness_up, boardHeight_up)
    drawPillars(f)
    drawWheels(f)
    drawArm(f, 'SLLRLL')
    
with open(fileName, 'w') as f:
    drawCar(f)
    