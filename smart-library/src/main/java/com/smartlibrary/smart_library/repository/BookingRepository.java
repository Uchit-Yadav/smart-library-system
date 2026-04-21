package com.smartlibrary.smart_library.repository;

import com.smartlibrary.smart_library.entity.Booking;
import com.smartlibrary.smart_library.entity.BookingStatus;
import com.smartlibrary.smart_library.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUser(User user);

    List<Booking> findByUserOrderByBookingDateDesc(User user);

    List<Booking> findByStatus(BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.seat.id = :seatId " +
            "AND b.bookingDate = :date " +
            "AND b.status = 'CONFIRMED' " +
            "AND b.startTime < :endTime " +
            "AND b.endTime > :startTime")
    List<Booking> findConflictingBookings(
            @Param("seatId") Long seatId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

}