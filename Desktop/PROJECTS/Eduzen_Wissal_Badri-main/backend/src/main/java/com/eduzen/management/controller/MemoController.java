package com.eduzen.management.controller;

import com.eduzen.management.model.Memo;
import com.eduzen.management.model.User;
import com.eduzen.management.repository.MemoRepository;
import com.eduzen.management.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/memos")
public class MemoController {

    private final MemoRepository memoRepository;
    private final UserRepository userRepository;

    public MemoController(MemoRepository memoRepository, UserRepository userRepository) {
        this.memoRepository = memoRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Memo>> getMyMemos(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .map(user -> ResponseEntity.ok(memoRepository.findByUserOrderByCreatedAtDesc(user)))
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping
    public ResponseEntity<?> createMemo(Authentication authentication, @RequestBody Map<String, String> payload) {
        return userRepository.findByUsername(authentication.getName())
                .map(user -> {
                    String content = payload.get("content");
                    if (content == null || content.trim().isEmpty()) {
                        return ResponseEntity.badRequest().body("Content cannot be empty");
                    }
                    Memo memo = new Memo();
                    memo.setContent(content);
                    memo.setUser(user);
                    return ResponseEntity.ok(memoRepository.save(memo));
                })
                .orElse(ResponseEntity.status(401).build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMemo(Authentication authentication, @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        if (userOpt.isEmpty())
            return ResponseEntity.status(401).build();

        Optional<Memo> memoOpt = memoRepository.findById(id);
        if (memoOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Memo memo = memoOpt.get();
        if (!memo.getUser().getId().equals(userOpt.get().getId())) {
            return ResponseEntity.status(403).build();
        }

        String content = payload.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Content cannot be empty");
        }

        memo.setContent(content);
        return ResponseEntity.ok(memoRepository.save(memo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMemo(Authentication authentication, @PathVariable Long id) {
        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        if (userOpt.isEmpty())
            return ResponseEntity.status(401).build();

        Optional<Memo> memoOpt = memoRepository.findById(id);
        if (memoOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Memo memo = memoOpt.get();
        // Security check: Ensure the memo belongs to the authenticated user
        if (!memo.getUser().getId().equals(userOpt.get().getId())) {
            return ResponseEntity.status(403).build();
        }

        memoRepository.delete(memo);
        return ResponseEntity.ok().build();
    }
}
