"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, Input } from "@akashnetwork/ui/components";
import { fromBech32, normalizeBech32 } from "@cosmjs/encoding";
import { Search } from "iconoir-react";
import { useRouter } from "next/navigation";

import { UrlService } from "@/lib/urlUtils";

enum SearchType {
  AccountAddress,
  ValidatorAddress,
  TxHash,
  BlockHeight
}

const SearchBar: React.FunctionComponent = () => {
  const [searchTerms, setSearchTerms] = useState("");
  const [searchType, setSearchType] = useState<SearchType | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setSearchType(getSearchType(searchTerms));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerms]);

  function onSearchTermsChange(ev: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerms(ev.target.value);
  }

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();

    const trimmedSearch = searchTerms.trim();

    if (trimmedSearch.length === 0) return;

    const searchType = getSearchType(trimmedSearch);

    switch (searchType) {
      case SearchType.AccountAddress:
        router.push(UrlService.address(normalizeBech32(trimmedSearch)));
        break;
      case SearchType.ValidatorAddress:
        router.push(UrlService.validator(normalizeBech32(trimmedSearch)));
        break;
      case SearchType.TxHash:
        router.push(UrlService.transaction(trimmedSearch.toUpperCase()));
        break;
      case SearchType.BlockHeight:
        router.push(UrlService.block(parseInt(trimmedSearch)));
        break;
    }
  }

  function getSearchType(search: string): SearchType | null {
    // Check if valid block height
    if (/^[0-9]+$/.test(search)) {
      return SearchType.BlockHeight;
    }
    // Check if tx hash
    else if (/^[A-Fa-f0-9]{64}$/.test(search)) {
      return SearchType.TxHash;
    } else {
      // Check if valid bech32 address
      const bech32 = parseBech32(search);
      if (bech32?.prefix === "akash") {
        return SearchType.AccountAddress;
      } else if (bech32?.prefix === "akashvaloper") {
        return SearchType.ValidatorAddress;
      }
    }

    return null;
  }

  function parseBech32(str: string) {
    try {
      return fromBech32(str);
    } catch {
      return null;
    }
  }

  return (
    <div className="relative flex-grow">
      <form onSubmit={onSubmit}>
        <Input
          type="search"
          value={searchTerms}
          onChange={onSearchTermsChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search by Address, Block Height, TxHash"
          startIcon={<Search className="size-4 text-muted-foreground" />}
          startIconClassName="pl-3"
        />

        {searchType === null && searchTerms.trim() && isFocused && (
          <div className="absolute -bottom-14 left-0 w-full">
            <Card>
              <CardContent className="!p-4">Invalid search term</CardContent>
            </Card>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
