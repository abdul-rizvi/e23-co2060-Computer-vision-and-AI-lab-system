import pandas as pd
import matplotlib.pyplot as plt
import os
import shutil

# Ensure test directory exists
test_dir = "test"
os.makedirs(test_dir, exist_ok=True)

# Read the Locust history data
csv_file = "code/backend/locust_stats_stats_history.csv"
if os.path.exists(csv_file):
    df = pd.read_csv(csv_file)
    
    # Filter only the aggregated rows
    df = df[df["Name"] == "Aggregated"]
    
    if not df.empty:
        # Create a figure with 2 subplots (Requests/s and Response Time)
        fig, ax1 = plt.subplots(figsize=(10, 6))

        color = 'tab:blue'
        ax1.set_xlabel('Timestamp')
        ax1.set_ylabel('Requests / Second (RPS)', color=color)
        ax1.plot(df["Timestamp"], df["Requests/s"], color=color, linewidth=2, label='RPS')
        ax1.tick_params(axis='y', labelcolor=color)
        ax1.tick_params(axis='x', rotation=45)

        ax2 = ax1.twinx()  
        color = 'tab:red'
        ax2.set_ylabel('Total Average Response Time (ms)', color=color)  
        ax2.plot(df["Timestamp"], df["Total Average Response Time"], color=color, linewidth=2, label='Avg Response Time (ms)')
        ax2.tick_params(axis='y', labelcolor=color)

        fig.tight_layout()
        plt.title('Locust Load Test Performance (50 Users)')
        
        # Save the plot
        plt.savefig(os.path.join(test_dir, "performance_graph.png"), dpi=300)
        print("Successfully generated performance_graph.png")
    else:
        print("No aggregated data found in CSV")
else:
    print(f"CSV file not found: {csv_file}")

# Move the locust csv files to the test directory
for file in os.listdir("code/backend"):
    if file.startswith("locust_stats_"):
        shutil.move(os.path.join("code/backend", file), os.path.join(test_dir, file))
        print(f"Moved {file} to {test_dir}")
