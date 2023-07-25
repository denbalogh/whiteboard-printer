#include "utils.h"

float calculateAngularDistance(float targetAngle, float currentAngle, bool *clockwise){
    float clockwiseDistance = 0;
    float counterclockwiseDistance = 0;

    if (targetAngle > currentAngle) {
      clockwiseDistance = targetAngle - currentAngle;
      counterclockwiseDistance = 360 - targetAngle + currentAngle;
    } else {
      clockwiseDistance = 360 - currentAngle + targetAngle;
      counterclockwiseDistance = currentAngle - targetAngle;
    }

    *clockwise = clockwiseDistance < counterclockwiseDistance;
    return min(clockwiseDistance, counterclockwiseDistance);
}

// Image format:
// rows separated by ';'
// point as t, no point as f
bool isImageCodeValid(String code){
  // check if code is empty
  if(code.length() == 0 || (code.length() == 1 && code.charAt(0) == ';')){
    return false;
  }

  int pixelsInARow = -1;
  int startIndex = 0;
  int foundIndex = 0;
  // check if code contains only t, f and ;
  for(int i = 0; i < code.length(); i++){
    if(code.charAt(i) != 't' && code.charAt(i) != 'f' && code.charAt(i) != ';'){
      return false;
    }
  }
  // check if every row has the same length
  while((foundIndex = code.indexOf(';', startIndex)) != -1){
    if(pixelsInARow == -1){
      pixelsInARow = foundIndex - startIndex;
    } else if(pixelsInARow == 0 || pixelsInARow != foundIndex - startIndex){
      return false;
    }
    startIndex = foundIndex + 1;
  }

  if(pixelsInARow != -1 && pixelsInARow != code.length() - startIndex){
    return false;
  }

  return true;
}

int getSemicolonsCount(String code){
  int semicolons = 0;
  
  for(int i = 0; i < code.length(); i++){
    if(code.charAt(i) == ';'){
      semicolons++;
    }
  }

  return semicolons;
}
