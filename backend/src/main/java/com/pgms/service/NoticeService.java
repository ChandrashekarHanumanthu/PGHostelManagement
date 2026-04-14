package com.pgms.service;

import com.pgms.dto.NoticeDto;
import com.pgms.entity.Hostel;
import com.pgms.entity.Notice;
import com.pgms.entity.User;
import com.pgms.repository.NoticeRepository;
import com.pgms.repository.UserRepository;
import com.pgms.service.UserContextService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;
    private final UserContextService userContextService;

    public NoticeService(NoticeRepository noticeRepository,
                         UserRepository userRepository,
                         UserContextService userContextService) {
        this.noticeRepository = noticeRepository;
        this.userRepository = userRepository;
        this.userContextService = userContextService;
    }

    public List<NoticeDto> getAllNotices() {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        return noticeRepository.findByHostelOrderByCreatedAtDesc(currentHostel)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public NoticeDto createNotice(Long adminUserId, NoticeDto dto) {
        User admin = userRepository.findById(adminUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        
        Notice notice = Notice.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .createdAt(LocalDateTime.now())
                .createdBy(admin)
                .hostel(currentHostel)
                .build();
        Notice saved = noticeRepository.save(notice);
        return toDto(saved);
    }

    public NoticeDto updateNotice(Long id, NoticeDto dto) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();
        Notice notice = noticeRepository.findByHostelAndId(currentHostel, id)
                .orElseThrow(() -> new RuntimeException("Notice not found in your hostel"));
        notice.setTitle(dto.getTitle());
        notice.setContent(dto.getContent());
        Notice saved = noticeRepository.save(notice);
        return toDto(saved);
    }

    public void deleteNotice(Long id) {
        Hostel currentHostel = userContextService.getCurrentUserHostel();  
        Notice notice = noticeRepository.findByHostelAndId(currentHostel, id)  
                .orElseThrow(() -> new RuntimeException("Notice not found in your hostel"));
        noticeRepository.delete(notice); 
    }

    private NoticeDto toDto(Notice notice) {
        return NoticeDto.builder()
                .id(notice.getId())
                .title(notice.getTitle())
                .content(notice.getContent())
                .createdAt(notice.getCreatedAt())
                .build();
    }
}

