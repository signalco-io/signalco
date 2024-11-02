export default function Sla() {
    return (
        <article className="prose mx-auto mt-12 max-w-3xl">
            <h1 id="service-level-agreement">Service Level Agreement</h1>
            <h3 id="services-availability">Services Availability</h3>
            <p>Signalco (&quot;Signalco&quot;, &quot;we&quot;, &quot;us&quot; and/or &quot;our&quot;) will use commercially reasonable
                efforts to make the platform as a service (&quot;Services&quot;) available 99.9% of the time,
                excluding any Scheduled Downtime or Unscheduled Downtime events, each as defined below
                (&quot;Services Level&quot;). The Services availability will be calculated by dividing the total
                number of minutes of uptime in the Services during an applicable calendar month by the
                total number of actual minutes in such month minus minutes of Scheduled Downtime and minus
                minutes of Excused Downtime, and then multiplying that amount by 100 (&quot;Uptime&quot;). If the
                Services fail to meet the above Services Level, you will receive a Credit equal to the result
                of the Services Credit calculation in <a href="#credits">Section Credits</a> of this SLA.</p>
            <p>This aggrement is effective as of 21 March 2022.</p>
            <p>Last updated: 21 March 2022</p>
            <h3 id="scheduled-downtime">Scheduled Downtime</h3>
            <p>We will use reasonable efforts to provide you with a minimum of (7) days&#39; advance notice for all
                scheduled downtime to perform system maintenance, backup and upgrade functions for the Services
                (the &quot;Scheduled Downtime&quot;) if the Services will be unavailable due to the performance of system maintenance,
                backup and upgrade functions. Scheduled Downtime will not exceed eight (8) hours per month and will be
                scheduled in advance during off-peak hours (based on PT). We will notify you via email of any Scheduled
                Downtime that will exceed two (2) hours.The duration of Scheduled Downtime is measured, in minutes,
                as the amount of elapsed time from when the Services are not available to perform operations to when the
                Services becomes available to perform operations. Daily system logs will be used to track Scheduled Downtime
                and any other Services outages.</p>
            <h3 id="unscheduled-downtime">Unscheduled Downtime</h3>
            <p>Unscheduled Downtime is defined as any time outside of the Scheduled Downtime when the Services are
                not available to perform operations, excluding any outages caused by the failure of any third-party vendor,
                the Internet in general, factors outside of our reasonable control, outages that resulted from your software
                or hardware or third party software or hardware, or both or any force majeure event (&quot;Excused Downtime&quot;).
                The measurement is in minutes.</p>
            <h3 id="credits">Credits</h3>
            <p>A Credit is the percentage of the monthly Services fees for the Services that is credited to you for an
                Unscheduled Downtime below the Services Level based on the Uptime as set forth below. In order to receive
                any of the Credits described below, you must notify Signalco in writing within 30 days from the time you become
                eligible to receive a Credit. You must also provide us with log files showing Unscheduled Downtime and the
                date and time it occurred. If you do not comply with these requirements, you will forfeit your right to receive
                a Credit. If a dispute arises with respect to this SLA, we will make a determination in good faith based on
                its system logs, monitoring reports, configuration records, and other available information.The maximum aggregate
                number of Credits issued by us to you for all Unscheduled Downtime in a single billing month will not exceed 50%
                of the amount due from you for the Services for the applicable month. Credits will be in the form of a monetary
                credit applied to future use of the Services and will be applied within 60 days after the Credit was requested.
                Credits are your sole and exclusive remedy for any violation of this SLA.</p>
            <p>Monthly uptime fee comparison:</p>
            <ul>
                <li>from 99% to 99.9% = 10% </li>
                <li>from 95% to 99% = 20%</li>
                <li>to 95% = 50%</li>
            </ul>
            <p>For any questions or concerns regarding service availability, you may contact us via the email: <a href="mailto:contact@signalco.io">contact@signalco.io</a></p>
        </article>
    );
}
