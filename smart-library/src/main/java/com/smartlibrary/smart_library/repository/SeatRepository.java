package com.smartlibrary.smart_library.repository;

import com.smartlibrary.smart_library.entity.Seat;
import com.smartlibrary.smart_library.entity.SeatType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    Optional<Seat> findBySeatNumber(String seatNumber);

    List<Seat> findByFloor(Integer floor);

    List<Seat> findBySection(String section);

    List<Seat> findByIsAvailableTrue();

    List<Seat> findByFloorAndSection(Integer floor, String section);

    List<Seat> findBySeatType(SeatType seatType);

    Boolean existsBySeatNumber(String seatNumber);
}