import {map} from 'lodash';

export const mapRequestToTableData = (result) => {
    let id = 0;
    return map(result.history, (historyRecord, historicalDate) => {
        return {
            id: id++,
            years: historicalDate,
            open: parseFloat(historyRecord.open),
            close: parseFloat(historyRecord.close),
            high: parseFloat(historyRecord.high),
            low: parseFloat(historyRecord.low),
            volume: parseFloat(historyRecord.volume),
        };
    })
};