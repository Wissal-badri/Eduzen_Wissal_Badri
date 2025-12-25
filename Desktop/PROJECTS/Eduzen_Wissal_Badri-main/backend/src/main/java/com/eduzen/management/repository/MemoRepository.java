package com.eduzen.management.repository;

import com.eduzen.management.model.Memo;
import com.eduzen.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemoRepository extends JpaRepository<Memo, Long> {
    List<Memo> findByUserOrderByCreatedAtDesc(User user);
}
