import { useEffect } from "react";
import { Header } from "../add-update-client/level-details/header";
import { Region } from "../add-update-client/level-details/region";
import { City } from "../add-update-client/level-details/city";
import { Building } from "../add-update-client/level-details/building";

export default function LevelDetails({
  levelConfig,
  setValues,
  values,
  active,
  setActive,
  onBoarding = false,
}) {
  const list = getList(levelConfig);

  useEffect(() => {
    if (list.length > 0 && !active) {
      setActive(list[0].key);
    }
  }, [list, active]);

  useEffect(() => {
    if (!values.regions || values.regions.length === 0) {
      const newRegion = {
        id: null,
        name: "",
        address: "",
        contact_person_name: "",
        phone_number: "",
        email: "",
        country_code: "+61",
        city: "",
        state: "",
        pin: "",
        country: "",
      };
      setValues("regions", [newRegion]);
    }

    if (!values.cities || values.cities.length === 0) {
      const newCity = {
        id: null,
        name: "",
        address: "",
        contact_person_name: "",
        parent_level_id: null,
        phone_number: "",
        email: "",
        country_code: "+61",
        city: "",
        state: "",
        pin: "",
        country: "",
      };
      setValues("cities", [newCity]);
    }

    if (!values.building || values.building.length === 0) {
      const newBuilding = {
        id: null,
        parent_level_id: null,
        building_id: "",
      };
      setValues("building", [newBuilding]);
    }
  }, []);

  const handleClick = (key) => setActive(key);

  const handleAdd = () => {
    if (active === "region") {
      const newRegion = {
        id: Date.now(),
        name: "",
        address: "",
        contact_person_name: "",
        phone_number: "",
        email: "",
        country_code: "+61",
        city: "",
        state: "",
        pin: "",
        country: "",
      };
      const updatedRegions = [...(values.regions || []), newRegion];
      setValues("regions", updatedRegions);
    } else if (active === "city") {
      const newCity = {
        id: Date.now(),
        name: "",
        address: "",
        contact_person_name: "",
        phone_number: "",
        email: "",
        country_code: "+61",
        city: "",
        state: "",
        pin: "",
        country: "",
      };
      const updatedCities = [...(values.cities || []), newCity];
      setValues("cities", updatedCities);
    } else if (active === "building") {
      const newBuilding = {
        id: Date.now(),
        building_id: "",
        parent_level_id: "",
      };
      const updatedBuilding = [...(values.building || []), newBuilding];
      setValues("building", updatedBuilding);
    }
  };

  const handleRemove = (id) => {
    if (active === "region") {
      const updatedRegions = (values.regions || []).filter((r) => r.id !== id);
      const updatedLevel1Ids = (values.level1_ids || []).filter(
        (rid) => rid !== id,
      );
      setValues("regions", updatedRegions);
      setValues("level1_ids", updatedLevel1Ids);
    } else if (active === "city") {
      const updatedCities = (values.cities || []).filter((c) => c.id !== id);
      const updatedLevel2Ids = (values.level2_ids || []).filter(
        (cid) => cid !== id,
      );
      setValues("cities", updatedCities);
      setValues("level2_ids", updatedLevel2Ids);
    }

    const updatedBuildingIds = (values.building_ids || []).filter(
      (bid) => bid !== id,
    );
    setValues("building_ids", updatedBuildingIds);
  };

  const handleRegionChange = (updatedRegion) => {
    const updatedRegions = (values.regions || []).map((r) =>
      r.id === updatedRegion.id ? updatedRegion : r,
    );
    setValues("regions", updatedRegions);
  };

  const handleCityChange = (updatedCity) => {
    const updatedCities = (values.cities || []).map((c) =>
      c.id === updatedCity.id ? updatedCity : c,
    );
    setValues("cities", updatedCities);
  };

  const handleBuildingChange = (updatedBuilding) => {
    const updatedBuildings = (values.building || []).map((c) =>
      c.id === updatedBuilding.id ? updatedBuilding : c,
    );
    setValues("building", updatedBuildings);
  };

  if (list.length === 0) {
    return (
      <div className="text-gray-500 text-sm text-center">
        No available levels to display.
      </div>
    );
  }

  return (
    <div className="flex gap-5 mt-5">
      {/* Sidebar */}

      <div className="w-[180px] space-y-2">
        {list.map((item, index) => (
          <button
            type="button"
            key={item.key}
            onClick={() => handleClick(item.key)}
            className={`w-full flex items-center justify-start gap-2 h-13 rounded-xl text-sm font-semibold px-5 cursor-pointer ${
              active === item.key
                ? "text-text_primary bg-bg_primary"
                : "bg-white text-text_secondary"
            }`}
          >
            <div
              className={`w-5 h-5 flex items-center justify-center text-xs font-semibold rounded-full text-white ${
                active === item.key ? "bg-primary" : "bg-gray-600"
              }`}
            >
              {index + 1}
            </div>
            {item.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
        {active === "region" && (
          <>
            <Header
              onBoarding={onBoarding}
              title={levelConfig?.level_1?.name}
              onAdd={handleAdd}
            />

            <div className="space-y-6">
              {(values.regions || []).map((region, index) => (
                <Region
                  title={levelConfig?.level_1?.name}
                  key={region.id || index}
                  index={index}
                  total={values.regions.length}
                  onRemove={() => handleRemove(region.id)}
                  onChange={handleRegionChange}
                  data={region}
                />
              ))}
            </div>
          </>
        )}

        {active === "city" && (
          <>
            {!onBoarding && (
              <Header title={levelConfig?.level_2?.name} onAdd={handleAdd} />
            )}
            <div className="space-y-6">
              {(values.cities || []).map((city, index) => (
                <City
                  key={city.id || index}
                  index={index}
                  title={levelConfig?.level_2?.name}
                  total={values.cities.length}
                  onRemove={() => handleRemove(city.id)}
                  data={city}
                  parentTitle={levelConfig?.level_1?.name}
                  onChange={handleCityChange}
                  onBoarding={onBoarding}
                />
              ))}
            </div>
          </>
        )}

        {active === "building" && (
          <>
            {!onBoarding && (
              <Header title={"Link Building"} onAdd={handleAdd} />
            )}
            <div className="space-y-6">
              {(values.building || []).map((city, index) => (
                <Building
                  key={city.id || index}
                  index={index}
                  total={values.building.length}
                  onRemove={() => handleRemove(city.id)}
                  data={city}
                  onChange={handleBuildingChange}
                  onBoarding={onBoarding}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function getList(levelConfig) {
  const temp = [];

  if (levelConfig?.level_1?.name && levelConfig?.level_1?.availability) {
    temp.push({
      key: "region",
      title: levelConfig.level_1.name,
    });
  }

  if (levelConfig?.level_2?.name && levelConfig?.level_2?.availability) {
    temp.push({
      key: "city",
      title: levelConfig.level_2.name,
    });
  }

  if (levelConfig?.level_3?.name && levelConfig?.level_3?.availability) {
    temp.push({
      key: "building",
      title: levelConfig.level_3.name,
    });
  }

  return temp;
}
