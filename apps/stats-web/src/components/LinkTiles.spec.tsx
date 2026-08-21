// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { LinkTiles } from "@/components/LinkTiles";
import { render, screen } from "@testing-library/react";

const ITEMS = [
  { key: "blog", eyebrow: "Blog", title: "What BME Means for Akash", body: "An explainer.", cta: "Read the post", href: "https://example.com/blog" },
  { key: "roadmap", eyebrow: "Roadmap", title: "AEP-76", body: "The proposal.", cta: "View the proposal", href: "https://example.com/roadmap" }
];

describe(LinkTiles.name, () => {
  it("renders each item's copy", () => {
    render(<LinkTiles items={ITEMS} />);

    expect(screen.getByText("What BME Means for Akash")).toBeInTheDocument();
    expect(screen.getByText("An explainer.")).toBeInTheDocument();
    expect(screen.getByText("AEP-76")).toBeInTheDocument();
    expect(screen.getByText("The proposal.")).toBeInTheDocument();
  });

  it("links each cta to its own href, opening in a new tab", () => {
    render(<LinkTiles items={ITEMS} />);

    const blogLink = screen.getByRole("link", { name: /Read the post/ });
    expect(blogLink).toHaveAttribute("href", "https://example.com/blog");
    expect(blogLink).toHaveAttribute("target", "_blank");
    expect(blogLink).toHaveAttribute("rel", "noreferrer");

    expect(screen.getByRole("link", { name: /View the proposal/ })).toHaveAttribute("href", "https://example.com/roadmap");
  });
});
