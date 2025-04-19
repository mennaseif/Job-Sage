export class ApiFeatures {
  constructor(mongooseQuery, searchQuery) {
    this.mongooseQuery = mongooseQuery;
    this.searchQuery = searchQuery;
  }

  workingTime() {
    if (this.searchQuery.workingTime) {
      this.mongooseQuery = this.mongooseQuery.find({
        workingTime: this.searchQuery.workingTime,
      });
    }
    return this;
  }

  jobLocation() {
    if (this.searchQuery.jobLocation) {
      this.mongooseQuery = this.mongooseQuery
        .where("jobLocation")
        .equals(this.searchQuery.jobLocation);
    }
    return this;
  }

  seniorityLevel() {
    if (this.searchQuery.seniorityLevel) {
      this.mongooseQuery = this.mongooseQuery
        .where("seniorityLevel")
        .equals(this.searchQuery.seniorityLevel);
    }
    return this;
  }

  jobTitle() {
    if (this.searchQuery.jobTitle) {
      this.mongooseQuery = this.mongooseQuery
        .where("jobTitle")
        .equals(this.searchQuery.jobTitle);
    }
    return this;
  }

  technicalSkills() {
    if (this.searchQuery.technicalSkills) {
      const skills = this.searchQuery.technicalSkills
        .split(",")
        .map((skill) => skill.trim());
      this.mongooseQuery = this.mongooseQuery
        .where("technicalSkills")
        .in(skills);
    }
    return this;
  }
}
