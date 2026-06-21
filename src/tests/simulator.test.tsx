import { fireEvent, render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it } from "vitest";
import { ImpactSimulator } from "../components/ImpactSimulator";
import { calculateEmissions } from "../utils/calculator";
import { getPrioritizedActions } from "../utils/decisionEngine";
import { CarbonAuditInput } from "../types";

describe("Impact simulator", () => {
  it("updates projected emissions and savings when actions are toggled", () => {
    const input: CarbonAuditInput = {
      transport: "car",
      commute_distance: 100,
      electricity_bill: 100,
      ac_usage: 5,
      food_habits: "non-vegetarian",
      shopping_frequency: "medium",
      flights_per_year: 0,
    };

    const profile = calculateEmissions(input);
    const actions = getPrioritizedActions(input);

    const Harness = () => {
      const [committedIds, setCommittedIds] = useState<string[]>([]);

      const onCommitToggle = (id: string) => {
        setCommittedIds((current) =>
          current.includes(id)
            ? current.filter((item) => item !== id)
            : [...current, id]
        );
      };

      return (
        <ImpactSimulator
          initialProfile={profile}
          actions={actions}
          committedIds={committedIds}
          onCommitToggle={onCommitToggle}
          onClearToggles={() => setCommittedIds([])}
        />
      );
    };

    render(<Harness />);

    const projectedFootprint = screen.getByText(/Projected Footprint/i);
    expect(projectedFootprint.nextElementSibling).toHaveTextContent("6.74");

    fireEvent.click(screen.getByRole("button", { name: /Set household AC/i }));
    expect(projectedFootprint.nextElementSibling).toHaveTextContent("6.62");
    expect(screen.getAllByText(/1,800\/yr/).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /Opt for protein-rich/i }));
    expect(projectedFootprint.nextElementSibling).toHaveTextContent("6.4");
    expect(screen.getAllByText(/3,560\/yr/).length).toBeGreaterThan(0);
  });
});
