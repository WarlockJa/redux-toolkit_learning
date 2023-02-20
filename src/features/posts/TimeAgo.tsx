import { parseISO, formatDistanceToNow } from "date-fns";

const TimeAgo = ({ timestamp }: { timestamp: string}) => {
    let timeAgo = ''
    if (timestamp) {
        const passedDate = parseISO(timestamp)
        const timePeriod = formatDistanceToNow(passedDate)

        timeAgo = `${timePeriod} ago`
    }

    return (
        <span title={timestamp}>
            &nbsp; <i>{timeAgo}</i>
        </span>
    )
}

export default TimeAgo