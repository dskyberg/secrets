
export default class EC2 {

  constructor(ec2_sdk) {
    this.ec2_sdk = ec2_sdk;
  }

  getRegions() {
    var params = {};
    var p1 = new Promise((resolve, reject) => {
      // Retrieves all regions/endpoints that work with EC2
      this.ec2_sdk.describeRegions(params, function(err, data) {
        var regions = [];
        if (err) {
          reject(err);
        } else {
          
          for( let i = 0; i < data.Regions.length; i++) {
            let rn = data.Regions[i].RegionName;
             regions.push(rn);
          }
          resolve(regions);
        }
      });

    })
    return p1;
  }
  
}
