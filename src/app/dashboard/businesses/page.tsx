"use client";

import { useState } from "react";
import {
  Store,
  MapPin,
  Star,
  DollarSign,
  Users,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { mockBusinesses } from "@/data/mock-businesses";
import { formatCurrency } from "@/lib/utils";
import { Business } from "@/types/business";

export default function BusinessesPage() {
  const [selected, setSelected] = useState<Business | null>(null);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-white mb-1">
          Businesses
        </h1>
        <p className="text-xs text-white/40 font-mono">
          Manage and explore your business profiles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Business List */}
        <div className="space-y-3">
          {mockBusinesses.map((biz) => (
            <button
              key={biz.id}
              onClick={() => setSelected(biz)}
              className={`w-full text-left border bg-black/40 p-5 hover:bg-white/5 transition-all ${
                selected?.id === biz.id
                  ? "border-white/30 bg-white/5"
                  : "border-white/10"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium truncate">{biz.name}</h3>
                    <span className="text-xs px-1.5 py-0.5 bg-white/5 border border-white/10 text-white/40">
                      {biz.priceRange}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">{biz.tagline}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-white/30">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      {biz.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-green-400" />
                      {formatCurrency(biz.monthlyRevenue)}/mo
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {biz.avgCustomersPerDay}/day
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 mt-1" />
              </div>
            </button>
          ))}
        </div>

        {/* Business Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="border border-white/10 bg-black/40 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-mono font-bold">
                      {selected.name}
                    </h2>
                    <span className="text-xs px-2 py-1 bg-white/5 border border-white/10 text-white/60 uppercase">
                      {selected.type}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed max-w-xl">
                    {selected.description}
                  </p>
                </div>
                <a
                  href={selected.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors border border-transparent hover:border-white/10"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                <div className="p-3 bg-white/[0.02] border border-white/5">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                    Revenue
                  </div>
                  <div className="text-lg font-mono font-bold text-green-400">
                    {formatCurrency(selected.monthlyRevenue)}
                  </div>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                    Customers
                  </div>
                  <div className="text-lg font-mono font-bold text-white">
                    {selected.avgCustomersPerDay}
                  </div>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                    Rating
                  </div>
                  <div className="text-lg font-mono font-bold text-yellow-400">
                    {selected.rating} / 5.0
                  </div>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                    Est.
                  </div>
                  <div className="text-lg font-mono font-bold">
                    {selected.establishedYear}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-xs text-white/50 mb-6">
                <MapPin className="w-3 h-3" />
                {selected.address}
              </div>

              {/* Products */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-white/40 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-3 h-3" />
                  Menu / Products ({selected.products.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selected.products.map((product) => (
                    <div
                      key={product.id}
                      className="p-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/5"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">
                            {product.name}
                          </span>
                          {product.isNew && (
                            <span className="text-[10px] px-1 py-0.5 bg-green-600/20 text-green-400 border border-green-600/40">
                              NEW
                            </span>
                          )}
                          {product.isPopular && (
                            <span className="text-[10px] px-1 py-0.5 bg-blue-600/20 text-blue-400 border border-blue-600/40">
                              HOT
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-white/60">
                          ${product.price}
                        </span>
                      </div>
                      <p className="text-xs text-white/30">
                        {product.description}
                      </p>
                      <div className="mt-1.5">
                        <span className="text-[10px] px-1.5 py-0.5 bg-white/5 border border-white/10 text-white/30">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ICP */}
              <div className="mt-8">
                <h3 className="text-xs uppercase tracking-wider text-white/40 mb-4">
                  Ideal Customer Profile
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div className="p-3 bg-white/[0.02] border border-white/5">
                    <div className="text-xs text-white/30 mb-1">Age Range</div>
                    <div className="text-sm font-mono">
                      {selected.icp.ageRange[0]} - {selected.icp.ageRange[1]}
                    </div>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5">
                    <div className="text-xs text-white/30 mb-1">
                      Income Range
                    </div>
                    <div className="text-sm font-mono">
                      {formatCurrency(selected.icp.incomeRange[0])} -{" "}
                      {formatCurrency(selected.icp.incomeRange[1])}
                    </div>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5">
                    <div className="text-xs text-white/30 mb-1">
                      Visit Frequency
                    </div>
                    <div className="text-sm font-mono capitalize">
                      {selected.icp.visitFrequency}
                    </div>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/5 md:col-span-3">
                    <div className="text-xs text-white/30 mb-2">Interests</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.icp.interests.map((interest) => (
                        <span
                          key={interest}
                          className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 text-white/60"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-white/10 bg-black/40 p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <Store className="w-12 h-12 text-white/10 mb-4" />
              <h3 className="text-sm font-mono text-white/30 mb-2">
                Select a business
              </h3>
              <p className="text-xs text-white/20">
                Click on a business from the list to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
