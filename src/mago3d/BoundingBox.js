'use strict';

/**
 * 어떤 일을 하고 있습니까?
 */
var BoundingBox = function() {
	if(!(this instanceof BoundingBox)) {
		throw new Error(Messages.CONSTRUCT_ERROR);
	}
	
	this.minX = 1000000.0; 
	this.minY = 1000000.0;
	this.minZ = 1000000.0;
  
	this.maxX = -1000000.0; 
	this.maxY = -1000000.0;
	this.maxZ = -1000000.0;
  
};

/**
 * 어떤 일을 하고 있습니까?
 * @param point3d 변수
 */
BoundingBox.prototype.setInit = function(point3d) {
  this.minX = point3d.x;
  this.minY = point3d.y;
  this.minZ = point3d.z;
  
  this.maxX = point3d.x; 
  this.maxY = point3d.y;
  this.maxZ = point3d.z;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param point3d 변수
 */
BoundingBox.prototype.expand = function(dist) {
  this.minX -= dist;
  this.minY -= dist;
  this.minZ -= dist;
  
  this.maxX += dist;
  this.maxY += dist;
  this.maxZ += dist;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param point3d
 */
BoundingBox.prototype.addPoint3D = function(point3d) {
  if(point3d.x < this.minX) this.minX = point3d.x;
  else if(point3d.x > this.maxX)this.maxX = point3d.x;
  
  if(point3d.y < this.minY)this.minY = point3d.y;
  else if(point3d.y > this.maxY)this.maxY = point3d.y;
  
  if(point3d.z < this.minZ)this.minZ = point3d.z;
  else if(point3d.z > this.maxZ)this.maxZ = point3d.z;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param boundingBox 변수
 */  
BoundingBox.prototype.addBox = function(boundingBox) {
  if(boundingBox.minX < this.minX)this.minX = boundingBox.minX;
  if(boundingBox.maxX > this.maxX)this.maxX = boundingBox.maxX;
  
  if(boundingBox.minY < this.minY)this.minY = boundingBox.minY;
  if(boundingBox.maxY > this.maxY)this.maxY = boundingBox.maxY;
  
  if(boundingBox.minZ < this.minZ)this.minZ = boundingBox.minZ;
  if(boundingBox.maxZ > this.maxZ)this.maxZ = boundingBox.maxZ;
};

/**
 * 어떤 일을 하고 있습니까?
 * @returns result
 */
BoundingBox.prototype.getMaxLength = function() {
  var result = this.maxX - this.minX;
  var dim_y = this.maxY - this.minY;
  var dim_z = this.maxZ - this.minZ;
  if(dim_y > result)result = dim_y;
  if(dim_z > result)result = dim_z;
  
  return result;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param resultPoint3d
 * @returns resultPoint3d
 */
BoundingBox.prototype.getCenterPoint3d = function(resultPoint3d) {
	if(resultPoint3d == undefined)
		resultPoint3d = new Point3D();
	
	resultPoint3d.set((this.maxX + this.minX)/2, (this.maxY + this.minY)/2, (this.maxZ + this.minZ)/2);
	return resultPoint3d;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param x 변수
 * @param y 변수
 * @param z 변수
 */
BoundingBox.prototype.isPoint3dInside = function(x, y, z) {
  if(x < this.minX || x > this.maxX)
  {
	  return false;
  }
  else if(y < this.minY || y > this.maxY)
  {
	  return false;
  }
  else if(z < this.minZ || z > this.maxZ)
  {
	  return false;
  }
  
  return true;
};

