import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    ArcElement, // Import for Doughnut Chart
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    ArcElement, // Register for Doughnut Chart
    Title,
    Tooltip,
    Legend
);

// Helper: Generate monthly labels
const getMonthlyLabels = () => {
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
        const month = new Date(
            now.getFullYear(),
            now.getMonth() - i,
            1
        ).toLocaleString("default", { month: "short" });
        months.push(month);
    }
    return months;
};

// Helper: Generate weekly labels
const getLastWeekLabels = () => {
    const labels = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
        const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        labels.push(day.toLocaleDateString("default", { weekday: "short" }));
    }
    return labels;
};

// Common Chart Options
const commonOptions = (titleText) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: titleText,
            align: "start",
            padding: { bottom: 30 },
            font: { size: 17 },
        },
        legend: { display: false },
        tooltip: {
            enabled: true,
            callbacks: {
                title: (tooltipItems) => `Label: ${tooltipItems[0].label}`,
                label: (tooltipItem) => `Value: ${tooltipItem.raw}`,
            },
        },
    },
    scales: {
        x: { grid: { color: "rgba(200, 200, 200, 0.2)" } },
        y: {
            grid: { display: false },
            beginAtZero: true,
            ticks: {
                stepSize: 25000,
            },
        },
    },
});

// Line Chart Component
export const LineChart = ({ dataList, title }) => {
    const data = {
        labels: getMonthlyLabels(),
        datasets: [
            {
                data: dataList,
                fill: true,
                backgroundColor: "#0abff7",
                borderColor: "#0abff7",
                tension: 0.4,
                pointBackgroundColor: "#0abff7",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#3f89fc",
                pointRadius: 0,
                pointHoverRadius: 5,
                borderWidth: 2,
            },
        ],
    };

    return (
        <div className="chart" style={{ width: "100%", height: "100%" }}>
            <Line data={data} options={commonOptions(title)} />
        </div>
    );
};

// Bar Chart Component
export const BarChart = ({ dataList }) => {
    const labels = getLastWeekLabels();
    const data = {
        labels,
        datasets: [
            {
                data: dataList,
                backgroundColor: "#408afd",
                borderRadius: 10,
                borderSkipped: false,
                barThickness: 6,
            },
        ],
    };

    return (
        <div className="chart" style={{ width: "100%", height: "100%" }}>
            <Bar data={data} options={commonOptions("Weekly Earnings")} />
        </div>
    );
};

// New Line Chart Component for Yearly Earnings
export const YearlyEarningsChart = ({ yearlyEarnings }) => {
    const data = {
        labels: ["2019", "2020", "2021", "2022", "2023"],
        datasets: [
            {
                label: "Yearly Earnings",
                data: yearlyEarnings,
                fill: false,
                borderColor: "#ff6384",
                tension: 0.4,
                pointBackgroundColor: "#ff6384",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#ff6384",
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2,
            },
        ],
    };

    return (
        <div className="chart" style={{ width: "100%", height: "100%" }}>
            <Line data={data} options={commonOptions("Yearly Earnings")} />
        </div>
    );
};

// Doughnut Chart Component
export const DoughnutChart = ({ categories }) => {
    const data = {
        labels: categories.map((category) => category.label),
        datasets: [
            {
                data: categories.map((category) => category.value),
                backgroundColor: ["#36a2eb", "#9966ff"],
                hoverBackgroundColor: ["#36a2eb", "#9966ff"],
            },
        ],
    };

    const doughnutOptions = {
        ...commonOptions("Users Breakdown"),
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            ...commonOptions("Users Breakdown").plugins,
            legend: {
                display: true,
                position: "top",
                labels: {
                    boxWidth: 20,
                    padding: 10,
                },
            },
        },
        scales: {
            x: { display: false },
            y: { display: false },
        },
    };

    return (
        <div className="chart" style={{ width: "100%", height: "300px" }}>
            <Doughnut data={data} options={doughnutOptions} />
        </div>
    );
};
