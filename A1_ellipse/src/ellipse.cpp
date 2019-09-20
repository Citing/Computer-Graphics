#include <iostream>
#include <fstream>
#include <cmath>

#define NORMALCHAR "\033[0m"
#define YELLOWCHAR "\033[33m"

const int canvasHeight = 1080;
const int canvasWidth = 1920;

class ellipse
{
private:
    int center_x, center_y;
    int squareA, squareB;
    float cos_theta, sin_theta;
    // black canvas
    struct pixel
    {
        char value_R = 0, value_G = 0, value_B = 0;
    };
    pixel img[canvasHeight][canvasWidth];

    // set a pixel to red
    void setRed(pixel& P)
    {
        P.value_R = (char)255;
        P.value_G = 0;
        P.value_B = 0;
    }
    // set a point to red
    void setPointRed(int x, int y)
    {
        // first calculate the coordinate of the pixel after rotation
        int x_rotate, y_rotate;
        x_rotate = round(x * cos_theta - y * sin_theta);
        y_rotate = round(x * sin_theta + y * cos_theta);
        // test whether the point is inside the canvas
        if (center_x + x_rotate > canvasWidth)
            return;
        if (center_x + x_rotate < 0)
            return;
        if (center_y + y_rotate > canvasHeight)
            return;
        if (center_y + y_rotate < 0)
            return;
        // set the pixel to red
        setRed(img[center_y + y_rotate][center_x + x_rotate]);
    }
    // test whether a pixel is red
    bool isRed(pixel P)
    {
        return ((char)255 == P.value_R && !P.value_G && !P.value_B);
    }
    // set all the four symmetry points to red
    void drawPoint(int x, int y)
    {
        setPointRed(x, y);
        setPointRed(-x, y);
        setPointRed(x, -y);
        setPointRed(-x, -y);
    }
    // draw an elliptical arc with Bresenhem algorithm
    void drawArc(int x, int y, int area)
    {
        int stopX = squareB * x;
        int stopY = squareA * y;
        switch (area)
        {
            // the area where the slope < -1
            case 1:
            {
                int changeX = squareB * (1 - (x << 1));
                int changeY = squareA * (1 + (y << 1));
                while (stopX > stopY)
                {
                    drawPoint(x, y);
                    int error = squareB * x * x + squareA * y * y - squareA * squareB;
                    if (((error + changeY) << 1) + changeX > 0)
                    {
                        --x;
                        changeX += squareB << 1;
                        stopX -= squareB;
                    }
                    ++y;
                    changeY += squareA << 1;
                    stopY += squareA;
                }
                break;
            }
            // the area where the slope > -1
            case 2:
            {
                int changeX = squareB * (1 + (x << 1));
                int changeY = squareA * (1 - (y << 1));
                while (stopX < stopY)
                {
                    drawPoint(x, y);
                    int error = squareB * x * x + squareA * y * y - squareA * squareB;
                    if (((error + changeX) << 1) + changeY > 0)
                    {
                        --y;
                        changeY += squareA << 1;
                        stopY -= squareA;
                    }
                    ++x;
                    changeX += squareB << 1;
                    stopX += squareB;
                }
                break;
            }
        default:
            break;
        }
    }
    // color the ellipse
    void color()
    {
        // scan by line
        for (int i = 0; i < canvasHeight; ++i)
        {
            int x1 = 0, x2 = 0;
            int flag = 0;
            for (int j = 0; j < canvasWidth; ++j)
            {
                if (isRed(img[i][j]))
                {
                    if (!flag)
                    {
                        x2 = x1 = j;
                        flag = 1;
                    }
                    else
                    {
                        x2 = j;
                    }
                }
            }
            if (x1 < x2)
            {
                for (int j = x1; j < x2; ++j)
                {
                    setRed(img[i][j]);
                }
            }
        }
        //scan by column
        for (int j = 0; j < canvasWidth; ++j)
        {
            int y1 = 0, y2 = 0;
            int flag = 0;
            for (int i = 0; i < canvasHeight; ++i)
            {
                if (isRed(img[i][j]))
                {
                    if (!flag)
                    {
                        y2 = y1 = i;
                        flag = 1;
                    }
                    else
                    {
                        y2 = i;
                    }
                }
            }
            if (y1 < y2)
            {
                for (int i = y1; i < y2; ++i)
                {
                    setRed(img[i][j]);
                }
            }
        }
    }
    // write pixel information to an output stream
    friend std::ostream& operator<<(std::ostream& out, const pixel& p)
    {
        out<<p.value_R<<p.value_G<<p.value_B;
        return out;
    }
public:
    // draw an ellipse with Bresenhem algorithm
    ellipse(int center_x, int center_y, int halfWidth, int halfHeight, float theta) :
        center_x(center_x), center_y(center_y), squareA(halfWidth * halfWidth), squareB(halfHeight * halfHeight), 
        cos_theta(cos(theta)), sin_theta(sin(theta))
    {
        // draw the elliptical arc in area I
        drawArc(halfWidth, 0, 1);
        // draw the elliptical arc in area II
        drawArc(0, halfHeight, 2);
        // color the ellipse
        color();
    }

    // output the ellipse to a ppm file
    void display(const std::string& fileName)
    {
        std::ofstream outFile(fileName);
        // ppm header
        outFile<<"P6\n"<<canvasWidth<<' '<<canvasHeight<<'\n'<< 255 <<'\n';
        // pixels in the image
        for (int i = canvasHeight-1; i >= 0; --i)
        {
            for (int j = 0; j < canvasWidth; ++j)
            {
                outFile<<img[i][j];
            }
        }
    }
};

int main()
{
    std::ios::sync_with_stdio(false);

    // get the parameters of the ellipse
    int center_x, center_y;
    int halfWidth, halfHeight;
    float theta;
    std::string fileName;
    std::cout<<YELLOWCHAR "center_x   : " NORMALCHAR;
    std::cin>>center_x;
    std::cout<<YELLOWCHAR "center_y   : " NORMALCHAR;
    std::cin>>center_y;
    std::cout<<YELLOWCHAR "half width : " NORMALCHAR;
    std::cin>>halfWidth;
    std::cout<<YELLOWCHAR "half height: " NORMALCHAR;
    std::cin>>halfHeight;
    std::cout<<YELLOWCHAR "theta      : " NORMALCHAR;
    std::cin>>theta;
    std::cout<<YELLOWCHAR "file name  : " NORMALCHAR;
    std::cin>>fileName;

    // draw the ellipse
    ellipse E(center_x, center_y, halfWidth, halfHeight, theta / 180.0 * M_PI);
    // output the ellipse to a file
    E.display(fileName+".ppm");
}