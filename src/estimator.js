const covid19ImpactEstimator = (data) => {
    let input = data;
    let { reportedCases } = input;

    function getCurrentlyInfected(factor){
        return reportedCases * factor
    }

    function getNumberInfectedByTime(time){
        let currentlyInfected = this.currentlyInfected;
        let factor = Math.trunc(time / 3);
        return currentlyInfected * (2 ** factor);
    }

    return {
        data: input,
        impact: {
            currentlyInfected: getCurrentlyInfected(10),
            infectionsByRequestedTime: getNumberInfectedByTime
        },
        severeImpact: {
            currentlyInfected: getCurrentlyInfected(50),
            infectionsByRequestedTime: getNumberInfectedByTime
        }
    }
};

export default covid19ImpactEstimator;
