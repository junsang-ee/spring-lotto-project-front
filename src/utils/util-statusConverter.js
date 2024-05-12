const convertWinningResult = (status) => {
    switch(status) {
        case "PENDING": return "미추첨"
        case "LOST": return "낙첨";
        case "FIRST_PLACE": return "당첨(1등)";
        case "SECOND_PLACE": return "당첨(2등)";
        case "THIRD_PLACE": return "당첨(3등)";
        case "FOURTH_PLACE": return "당첨(4등)";
        case "FIFTH_PLACE": return "당첨(5등)";
        case "WAITING": return "추첨 대기";
    }
}

export { convertWinningResult }